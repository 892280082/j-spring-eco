if ! type pm2 >/dev/null 2>&1; then
    echo 'pm2 not install';
    npm install pm2 -g
else
    echo 'pm2 already installed';
fi

node ./bin/build.js
cnpm install
pm2 start .runtemp.js -n spring-application-template