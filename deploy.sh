#!/bin/bash

set -o errexit # Exit on error

# Functions gitCheck, return string that represent the status of the repo
gitCheck() {
	git remote update > /dev/null 2>&1
	LOCAL=$(git rev-parse @)
	REMOTE=$(git rev-parse @{u})
	BASE=$(git merge-base @ @{u})

	if [ $LOCAL = $REMOTE ]; then
	    echo "Up-to-date"
	elif [ $LOCAL = $BASE ]; then
	    echo "Need to pull"
	elif [ $REMOTE = $BASE ]; then
	    echo "Need to push"
	else
	    echo "Diverged"
	fi
}

echo "pull node-mondeavie"
git pull

### react-admin
echo "check react-admin"
cd ../react-admin
gitStatus=$(gitCheck)
if [ "$gitStatus" = "Need to pull" ]; then
	git pull
	echo "rebuild react-admin"
	npm run deploy
fi

### react-calendar
echo "check react-calendar"
cd ../react-calendar
gitStatus=$(gitCheck)
if [ "$gitStatus" = "Need to pull" ]; then
	git pull
	echo "rebuild react-calendar"
	npm run deploy
fi

### copy files to app/dist
cd ../node-mondeavie
echo "remove ./app and copy react-admin react-calendar into app/dist"
rm -rf ./app/
mkdir -p ./app/dist/
cp -a ../react-admin/dist ./app/dist/react-admin
cp -a ../react-calendar/dist ./app/dist/react-calendar

echo "deploy success !"
