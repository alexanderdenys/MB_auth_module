import { authService } from './auth.service.js';

class AuthController {
  async registerUserFirstStep(req, res) {
    try {
      const result = await authService.registerUserFirstStep(req.body);
      if (result.ErrorMessage) {
        res.status(400).send(result);
      } else {
        res.send(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ ErrorMessage: 'Server error' });
    }
  }

  async loginUserFirstStep(req, res) {
    try {
      const result = await authService.loginUserFirstStep(req.body);
      if (result.ErrorMessage) {
        res.status(400).send(result);
      } else {
        res.send(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ ErrorMessage: 'Server error' });
    }
  }

  async registerUserSecondStep(req, res) {
    try {
      const result = await authService.registerUserSecondStep(req.body);
      if (result.ErrorMessage) {
        res.status(400).send(result);
      } else {
        res.send(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ ErrorMessage: 'Server error' });
    }
  }

  async loginUserSecondStep(req, res) {
    try {
      const result = await authService.loginUserSecondStep(req.body);
      if (result.ErrorMessage) {
        res.status(400).send(result);
      } else {
        res.send(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ ErrorMessage: 'Server error' });
    }
  }

  async refreshSecret(req, res) {
    try {
      const result = await authService.refreshSecretCode(req.body);
      if (result.ErrorMessage) {
        res.status(400).send(result);
      } else {
        res.send(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ ErrorMessage: 'Server error' });
    }
  }
}

export const authController = new AuthController(authService);
