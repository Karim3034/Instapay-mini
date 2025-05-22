@echo off
echo Building all services...


rem 
echo Building discovery-service...
cd discovery-service
call ..\mvnw.cmd clean package -DskipTests
cd ..

echo Building config-server...
cd config-server
call ..\mvnw.cmd clean package -DskipTests
cd ..

echo Building user-service...
cd user-service
call ..\mvnw.cmd clean package -DskipTests
cd ..

echo Building transaction-service...
cd transaction-service
call ..\mvnw.cmd clean package -DskipTests
cd ..

echo Building reporting-service...
cd reporting-service
call ..\mvnw.cmd clean package -DskipTests
cd ..

echo Building api-gateway...
cd api-gateway
call ..\mvnw.cmd clean package -DskipTests
cd ..

echo All services built successfully!