Setup:
npm install -g artillery@latest
npm install artillery artillery-engine-playwright playwright

Sample to run tests:
artillery run --output results.json ./src/artillery-tests/api/swagger_pet_store/create-pet-store-load-test.yml
artillery run --output results.json ./src/artillery-tests/api/swagger_pet_store/delete-pet-store-load-test.yml
