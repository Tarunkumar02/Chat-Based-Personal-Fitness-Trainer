/**
 * Validates the structure of a plan returned by Gemini
 * Returns { valid: boolean, errors: string[] }
 */
const validatePlanJSON = (planData) => {
  const errors = [];

  if (!planData) {
    errors.push('Plan data is empty');
    return { valid: false, errors };
  }

  // Validate plan section
  if (!planData.plan) {
    errors.push('Missing "plan" object');
  } else {
    if (typeof planData.plan.type !== 'string') {
      errors.push('plan.type must be a string');
    }
    if (typeof planData.plan.durationWeeks !== 'number') {
      errors.push('plan.durationWeeks must be a number');
    }
    if (typeof planData.plan.workoutDaysPerWeek !== 'number') {
      errors.push('plan.workoutDaysPerWeek must be a number');
    }
    if (!Array.isArray(planData.plan.exercises)) {
      errors.push('plan.exercises must be an array');
    }
  }

  // Validate nutrition section (optional but recommended)
  if (planData.nutrition) {
    if (typeof planData.nutrition.dailyCalories !== 'number') {
      errors.push('nutrition.dailyCalories must be a number');
    }
    if (!planData.nutrition.macros) {
      errors.push('nutrition.macros is missing');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

module.exports = { validatePlanJSON };
