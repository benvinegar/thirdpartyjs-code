<?php

/**
 * Presume that the username/password submitted is correct, and
 * set a cookie containing the user's "sessionid". This isn't a real
 * username/password form - we're just trying to set cookies!
 */
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	setcookie('session_id', 'abcdef123456');
}

?>
<!DOCTYPE html>
<html>
    <head>
    	<title>Sign in to Camera Stork</title>
        <link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css">
        <style>
            html { overflow-y: hidden; }
            body { padding: 20px 0 0 0; margin: 0; }
            .actions span { margin-left: 10px; }
        </style>
    </head>
    <body>
        <form method="POST">
            <fieldset>
            <legend>Sign in</legend>
                <div class="clearfix">
                    <label>Username</label>
                    <div class="input"><input type="text" value="johndoe"/></div>
                </div>

                <div class="clearfix">
                    <label>Password</label>
                    <div class="input"><input type="password" value="balderdash"/></div>
                </div>
            </fieldset>
            <div class="actions">
                <button type="submit" class="btn large primary">Sign in</button>
                <span>or <a href="">Cancel</a></span>
            </div>
    	</form>

<?php 

/** 
 * If the form submit is successful (every POST), output JavaScript that
 * will send a success message to the parent window.
 */
if ($_SERVER['REQUEST_METHOD'] == 'POST') { 

?>

		<script>
			window.opener.postMessage(JSON.stringify({success: true, name: 'John Doe'}), '*');
		</script>
<? } ?>
    </body>
</html>