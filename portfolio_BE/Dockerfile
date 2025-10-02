# Bygg med Gradle i en första stage
FROM gradle:8.10-jdk17 AS builder
WORKDIR /home/gradle/project
COPY . .
RUN gradle bootJar --no-daemon

# Kör appen i en minimal JDK-bild
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /home/gradle/project/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]