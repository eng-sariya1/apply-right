const mammoth = require('mammoth');

const filePath = String.raw`C:\Users\iyadm\Downloads\Telegram Desktop\senior-project-sample.docx`;

mammoth.extractRawText({path: filePath})
  .then(result => {
    console.log(result.value);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
