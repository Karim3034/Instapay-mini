FROM openjdk:21

WORKDIR /app

COPY target/reporting-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
