// utils/validators.js
export const validateTask = (task) => {
  const errors = {};

  // Title validation
  if (!task.title || task.title.trim() === '') {
    errors.title = 'Title is required';
  } else if (task.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Description validation
  if (task.description && task.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateComment = (comment) => {
  const errors = {};

  if (!comment || comment.trim() === '') {
    errors.content = 'Comment cannot be empty';
  } else if (comment.length > 1000) {
    errors.content = 'Comment must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};