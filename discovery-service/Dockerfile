FROM openjdk:21

WORKDIR /app

COPY target/discovery-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8761


ENTRYPOINT ["java", "-jar", "app.jar"]
