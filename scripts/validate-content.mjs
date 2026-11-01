import { validateContent } from './content-validation.mjs';

const { errors, warnings } = validateContent();

for (const warning of warnings) console.warn(`Content validation warning: ${warning}`);

if (errors.length > 0) {
  console.error('Content validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Content validation passed.');