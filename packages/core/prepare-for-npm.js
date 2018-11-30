const ghpages = require('gh-pages');

function callback(err) {
  if(err) {
    console.error(err);
    return;
  }
  console.info('Branch published successfully');
}

ghpages.publish('.', { branch: 'npm', src: ['dist/**/*', 'package.json', '.npmignore'] }, callback);
