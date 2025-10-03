# Bygg med Gradle i en första stage
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /home/gradle/project
COPY . .
RUN gradle bootJar --no-daemon

# Kör appen i en minimal JDK-bild
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /home/gradle/project/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]