# ---------- Build stage ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy wrapper + Gradle build files first (cache-friendly).
# Wildcards handle Groovy/Kotlin DSL (build.gradle / build.gradle.kts)
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle* ./
COPY settings.gradle* ./

# Make wrapper executable & warm Gradle cache
RUN chmod +x ./gradlew
RUN ./gradlew --no-daemon help || true

# Copy the rest and build
COPY . .
RUN ./gradlew --no-daemon clean bootJar

# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]