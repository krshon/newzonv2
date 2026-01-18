<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "🔍 Starting register.php<br>";

$conn = new mysqli("localhost", "root", "", "newzon_users");

if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}
echo "✅ Connected to DB<br>";

// Check if form submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST['username']) && isset($_POST['password'])) {
        $user = $_POST['username'];
        $pass = password_hash($_POST['password'], PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->bind_param("ss", $user, $pass);

        if ($stmt->execute()) {
            echo "✅ User registered successfully!";
        } else {
            echo "❌ Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "❌ Username or password not set!";
    }
} else {
    echo "👋 No form submitted!";
}

$conn->close();
?>
