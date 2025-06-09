#!/bin/bash
echo "Deploying LockraWallet..."
docker-compose down
docker-compose build
docker-compose up -d
echo "Deployment complete."
