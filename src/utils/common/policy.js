import global from "../../config/global";
import { CipherType } from "../../core-js/src/enums";

const checkPasswordPolicy = (password) => {
  const violations = [];
  const syncPolicies = global.store.getState().sync.syncPolicies || [];
  const policy = syncPolicies.find((p) => p.policyType === 'password_requirement' && p.enabled)
  if (!policy || !password) {
    return []
  }
  if (policy?.config) {
    if (policy.config.minLength && password.length < policy.config.minLength) {
      violations.push({ key: 'minLength', value: policy.config.minLength })
    }
    if (policy.config.requireSpecialCharacter) {
      const reg = /(?=.*[!@#$%^&*])/
      const check = reg.test(password)
      if (!check) {
        violations.push({ key: 'requireSpecialCharacter' })
      }
    }
    if (policy.config.requireLowerCase) {
      const reg = /[a-z]/
      const check = reg.test(password)
      if (!check) {
        violations.push({ key: 'requireLowerCase' })
      }
    }
    if (policy.config.requireUpperCase) {
      const reg = /[A-Z]/
      const check = reg.test(password)
      if (!check) {
        violations.push({ key: 'requireUpperCase' })
      }
    }
    if (policy.config.requireDigit) {
      const reg = /[1-9]/
      const check = reg.test(password)
      if (!check) {
        violations.push({ key:  'requireDigit' })
      }
    }
  }
  return violations
}

const violatedPasswordCiphers = (allCiphers) => {
  const violatedCiphers = []
  allCiphers.forEach(c => {
    if (
      c.type !== CipherType.Login ||
      c.login.password == null ||
      c.login.password === '' ||
      c.isDeleted
    ) {
      return
    }
    const violations = checkPasswordPolicy(c.login.password || '') || []
    if (violations.length) {
      violatedCiphers.push({
        ...c,
        violations
      })
    }
  })
  return violatedCiphers
}

export default {
  checkPasswordPolicy,
  violatedPasswordCiphers
}