function load() {
    var review = document.getElementById('review');
    review.innerHTML = "This camera is great!";
    review.innerHTML += "<script>alert('Hello, World!');</script>";
}