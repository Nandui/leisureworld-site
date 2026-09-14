<?php
declare(strict_types=1);

// Configure the production mailbox and mail transport on the PHP host.
// Success means the transport accepted the email, not proof of inbox delivery.
function respond(int $status, bool $success, string $message): void {
    http_response_code($status);
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['success' => $success, 'message' => $message]);
    } else {
        header('Content-Type: text/html; charset=UTF-8');
        $title = $success ? 'Message sent' : 'Message not sent';
        $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
        echo '<!doctype html><html lang="en-IE"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>' . $title . ' — LeisureWorld Cork</title><link rel="stylesheet" href="homepage.css"><link rel="stylesheet" href="site-pages.css"></head><body><main class="content-width section-space"><h1>' . $title . '</h1><div class="prose"><p>' . $safe . '</p><p><a href="contact.html#message">Return to the contact page</a></p><p>You can also email <a href="mailto:info@leisureworldcork.com">info@leisureworldcork.com</a>.</p></div></main></body></html>';
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Please use the contact form to send an enquiry.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 25000) {
    respond(413, false, 'Your message is too long. Please keep it under 5,000 characters.');
}
function field(string $name): string {
    $value = $_POST[$name] ?? '';
    return is_string($value) ? trim(str_replace("\0", '', strip_tags($value))) : '';
}
if (field('website') !== '') respond(400, false, 'Please contact reception directly.');
$fname = field('fname');
$lname = field('lname');
$email = field('email');
$centre = field('centre');
$enquiry = field('enquiry');
$message = field('message');
$centres = ['Bishopstown', 'Churchfield', 'Douglas', 'Not sure / General'];
$topics = ['Membership & Pricing', 'Swimming Lessons', 'Fitness Classes', 'Astro Pitch Hire', 'Summer Camps', 'Health Programmes', 'Lifeguard Training', 'Swim Teacher Training', 'Gift Vouchers', 'Accessibility', 'General Enquiry'];
function textLength(string $value): int {
    $count = preg_match_all('/./us', $value);
    return $count === false ? PHP_INT_MAX : $count;
}
if (!$fname || !$lname || !$message || !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !in_array($centre, $centres, true) || !in_array($enquiry, $topics, true) ||
    textLength($fname) > 100 || textLength($lname) > 100 || strlen($email) > 254 || textLength($message) > 5000) {
    respond(422, false, 'Check all required fields, enter a valid email address and keep your message under 5,000 characters.');
}

$to = getenv('LEISUREWORLD_CONTACT_TO') ?: 'info@leisureworldcork.com';
if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    respond(503, false, 'The enquiry service is temporarily unavailable. Please email reception.');
}
$subject = 'Website enquiry: ' . $enquiry . ' (' . $centre . ')';
$body = "LeisureWorld website enquiry\n\nName: $fname $lname\nEmail: $email\nCentre: $centre\nTopic: $enquiry\n\nMessage:\n$message\n";
$replyTo = str_replace(["\r", "\n"], '', $email);
$headers = ['From' => 'LeisureWorld Website <noreply@leisureworldcork.com>', 'Reply-To' => $replyTo, 'MIME-Version' => '1.0', 'Content-Type' => 'text/plain; charset=UTF-8'];
if (!function_exists('mail') || !mail($to, $subject, $body, $headers)) {
    respond(503, false, 'Your message could not be sent. Please email info@leisureworldcork.com or call your centre.');
}
respond(200, true, 'Thank you for contacting LeisureWorld. Our team will respond to the email address you provided.');
