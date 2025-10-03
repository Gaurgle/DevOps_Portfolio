# ---------- Build stage ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# 1) Copy wrapper & build files first to leverage Docker layer cache
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle build.gradle
COPY build.gradle.kts build.gradle.kts
COPY settings.gradle settings.gradle
COPY settings.gradle.kts settings.gradle.kts

# Make wrapper executable
RUN chmod +x ./gradlew

# Prime Gradle (downloads wrapper/daemon and caches dependencies as much as possible)
RUN ./gradlew --no-daemon help || true

# 2) Copy the rest of the project
COPY . .

# Build fat jar
RUN ./gradlew --no-daemon clean bootJar

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built jar (wildcard handles versioned names)
COPY --from=builder /app/build/libs/*.jar app.jar

# Optional JVM ergonomics
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75"

EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]