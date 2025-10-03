# ---------- Build stage ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy wrapper + build files first
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle build.gradle
COPY build.gradle.kts build.gradle.kts
COPY settings.gradle settings.gradle
COPY settings.gradle.kts settings.gradle.kts

# Make wrapper executable & prime Gradle
RUN chmod +x ./gradlew
RUN ./gradlew --no-daemon help || true

# Copy the rest of the project
COPY . .
RUN ./gradlew --no-daemon clean bootJar

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]