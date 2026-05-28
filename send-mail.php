<?php
// =============================================================================
// send-mail.php
// Receives the contact form data and emails it to the configured recipient.
// =============================================================================

// Always respond in JSON.
header("Content-Type: application/json");

// ── 1. Only allow POST requests ───────────────────────────────────────────────
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

// ── 2. Pull in and sanitise each field ───────────────────────────────────────
//    For plain-text emails, strip_tags + trim is cleaner than SPECIAL_CHARS,
//    which HTML-encodes & / < / > and makes the email body look weird.
function clean_field($key) {
    if (!isset($_POST[$key])) return "";
    return trim(strip_tags((string) $_POST[$key]));
}

// Removes characters that could inject new headers (CR/LF/null).
function header_safe($value) {
    return str_replace(["\r", "\n", "\0", "%0a", "%0d"], "", $value);
}

$fname   = clean_field("fname");
$lname   = clean_field("lname");
$email   = clean_field("email");
$centre  = clean_field("centre");
$enquiry = clean_field("enquiry");
$message = clean_field("message");

// ── 3. Basic server-side validation ──────────────────────────────────────────
if (!$fname || !$lname || !$email || !$centre || !$enquiry || !$message) {
    echo json_encode(["success" => false, "error" => "All fields are required."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "error" => "Invalid email address."]);
    exit;
}

// ── 4. Where the email goes ───────────────────────────────────────────────────
//    🔧 Change this to info@leisureworldcork.com when going live.
$to      = "nikitajoisa@gmail.com";
$subject = "Website Enquiry – {$enquiry} ({$centre})";

// ── 5. Build the email body ───────────────────────────────────────────────────
$body  = "You have received a new enquiry from the Leisureworld website.\n\n";
$body .= "------------------------------\n";
$body .= "Name:    {$fname} {$lname}\n";
$body .= "Email:   {$email}\n";
$body .= "Centre:  {$centre}\n";
$body .= "Enquiry: {$enquiry}\n";
$body .= "------------------------------\n\n";
$body .= "Message:\n{$message}\n\n";
$body .= "------------------------------\n";
$body .= "This email was sent from the contact form at leisureworldcork.com\n";

// ── 6. Email headers ──────────────────────────────────────────────────────────
//    Reply-To lets you reply straight to the visitor from your inbox.
//    header_safe() prevents newline / header-injection attacks through the name.
$reply_name  = header_safe("{$fname} {$lname}");
$reply_email = header_safe($email);

$headers  = "From: Leisureworld Website <noreply@leisureworldcork.com>\r\n";
$headers .= "Reply-To: {$reply_name} <{$reply_email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ── 7. Send it ────────────────────────────────────────────────────────────────
$sent = mail($to, $subject, $body, $headers);

// ── 8. Tell the browser what happened ────────────────────────────────────────
if ($sent) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode([
        "success" => false,
        "error"   => "mail() failed – check server mail settings."
    ]);
}
?>