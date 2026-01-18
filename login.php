<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "newzon_users";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$user = $_POST['username'];
$pass = $_POST['password'];

// Fetch user from DB
$sql = "SELECT * FROM users WHERE username = '$user'";
$result = $conn->query($sql);

if ($result->num_rows === 1) {
  $row = $result->fetch_assoc();
  if (password_verify($pass, $row['password'])) {
    $_SESSION['username'] = $user;
    echo "Login successful! Welcome, $user!";
    // Redirect if needed
    // header("Location: home.html");
  } else {
    echo "❌ Incorrect password!";
  }
} else {
  echo "❌ No such user found!";
}
$conn->close();
?>
