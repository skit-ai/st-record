build:
	cd ./st_record/frontend; npm run build; cd ../..
	poetry build -f wheel
