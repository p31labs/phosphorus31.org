#!/bin/bash
# Integration Test Script
# Starts all services, runs tests, then tears down

set -e

echo "🔺 P31 Labs — Integration Testing"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Starting integration test environment...${NC}"
docker-compose -f docker-compose.integration.yml up -d

echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Wait for services to be ready
echo -e "${YELLOW}🔍 Checking service health...${NC}"

# Check Centaur
for i in {1..30}; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ The Centaur is healthy${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ The Centaur failed to start${NC}"
        docker-compose -f docker-compose.integration.yml logs centaur
        exit 1
    fi
    sleep 2
done

# Check Buffer
for i in {1..30}; do
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ The Buffer is healthy${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ The Buffer failed to start${NC}"
        docker-compose -f docker-compose.integration.yml logs buffer
        exit 1
    fi
    sleep 2
done

# Check Scope
for i in {1..30}; do
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ The Scope is healthy${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ The Scope failed to start${NC}"
        docker-compose -f docker-compose.integration.yml logs scope
        exit 1
    fi
    sleep 2
done

# Check Mock Node One
for i in {1..30}; do
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Mock Node One is healthy${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Mock Node One failed to start${NC}"
        docker-compose -f docker-compose.integration.yml logs node-one-mock
        exit 1
    fi
    sleep 2
done

echo ""
echo -e "${GREEN}🚀 All services are healthy. Running integration tests...${NC}"
echo ""

# Run integration tests
cd ui
npm run test:integration

TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Integration tests passed!${NC}"
else
    echo -e "${RED}❌ Integration tests failed${NC}"
fi

echo ""
echo -e "${YELLOW}🧹 Tearing down integration test environment...${NC}"
cd ..
docker-compose -f docker-compose.integration.yml down

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🔺 The mesh holds. Integration testing complete.${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Integration testing failed. Check logs above.${NC}"
    exit 1
fi
