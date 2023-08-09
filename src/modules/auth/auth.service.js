import validator from 'validator';
import crypto from 'crypto';
import { Users } from '../../models/UserModel.js';
import notificationConfig from '../../config/notification.config.js';
import NotificationService from '../../utils/notification.util.js';

// Кэш для кодов авторизации
const codeCache = new Map();
// Кэш для ошибок кодов авторизации
const errorCounter = new Map();
// Инициализация сервиса уведомлений
const notificationService = new NotificationService(
  notificationConfig.email,
);

class AuthService {
  // Валидация адреса электронной почты
  validateEmail(email) {
    return validator.isEmail(email);
  }

  // Генерация секретного ключа
  generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Генерация кода регистрации
  generateRegistrationCode(length = 6) {
    const characters = '0123456789';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  }

  // Проверка существования пользователя
  async checkUserExists(email) {
    return await Users.findOne({ email }) !== null;
  }

  // Отправка кода авторизации
  async sendAuthCode(email, code) {
    await notificationService.sendEmail({
      from: ' <me@outlook.com>',
      to: email,
      subject: 'Authorization',
      text: `Hello, your code is ${code}`,
      html: `<h3>Hello, your code is</h3><br><h1>${code}</h1>`,
    });
  }

  // Валидация данных пользователя
  async validateUser(email, registration) {
    if (!this.validateEmail(email)) {
      throw new Error('Provided email is not valid. Valid email example is: example@example.com.');
    }
    if (registration && (await this.checkUserExists(email))) {
      throw new Error('A user with this email already exists.');
    }
    if (!registration && !(await this.checkUserExists(email))) {
      throw new Error('We don’t have such user, please try again.');
    }
  }

  // Проверка введенного кода
  async validateCode(regIdentifier, providedCode) {
    const cachedCode = codeCache.get(regIdentifier);
    if (!cachedCode) {
      throw new Error('Code has expired or not found.');
    }
    if (providedCode !== cachedCode) {
      // Увеличиваем счетчик ошибок и сохраняем в Map
      const errorCount = (errorCounter.get(regIdentifier) || 0) + 1;
      errorCounter.set(regIdentifier, errorCount);

      if (errorCount >= 3) {
        throw new Error('You have no attempts left. Please, resubmit data.');
      }
      throw new Error('Invalid code.');
    }
    // Сбрасываем счетчик ошибок при успешной проверке
    errorCounter.delete(regIdentifier);
    codeCache.delete(regIdentifier);
  }

  // Первый шаг авторизации или регистрации
  async firstStepLoginOrRegistration(regIdentifier, isRegistration) {
    await this.validateUser(regIdentifier, isRegistration);
    const sixDig = this.generateRegistrationCode(6);
    await this.sendAuthCode(regIdentifier, sixDig);
    codeCache.set(regIdentifier, sixDig);
    setTimeout(() => {
      codeCache.delete(regIdentifier);
    }, 10 * 60 * 1000);
    return { SuccessMessage: 'Ok' };
  }

  // Регистрация пользователя - первый шаг
  async registerUserFirstStep(data) {
    return await this.firstStepLoginOrRegistration(data.login, true);
  }

  // Регистрация пользователя - второй шаг
  async registerUserSecondStep({ login: email, sixDig: providedCode }) {
    await this.validateCode(email, providedCode);
    const secret = this.generateSecretKey();
    return await Users.create({ email, secret });
  }

  // Вход пользователя - первый шаг
  async loginUserFirstStep(data) {
    return await this.firstStepLoginOrRegistration(data.login, false);
  }

  // Вход пользователя - второй шаг
  async loginUserSecondStep({ login: email, sixDig: providedCode }) {
    await this.validateCode(email, providedCode);
    const secret = this.generateSecretKey();
    await Users.updateOne({ email }, { secret });
    const updatedUser = await Users.findOne({ email });

    // Если у пользователя есть поле isRegistrated, удаляем его
    if (updatedUser.isRegistrated !== undefined) {
      await Users.updateOne({ email }, { $unset: { isRegistrated: 1 } });
      updatedUser.isRegistrated = undefined;
    }

    return updatedUser;
  }

  // Рефреш секретного кода при закрытии или открытии приложения
  async refreshSecretCode(data) {
    const { id: userId, secret: providedSecretCode } = data;
    const user = await Users.findById(userId);
    if (user.secret !== providedSecretCode) {
      throw new Error('Invalid code.');
    }
    const newSecretCode = this.generateSecretKey();
    user.secret = newSecretCode;
    await user.save();
    return await Users.findById(userId).populate('role');
  }
}

export const authService = new AuthService();
