
function activeCampaignEvent(email) {
  var url = "https://trackcmp.net/event";
  var email = encodeURIComponent(email);
  var event = "leadform-cta";
  var id = "999887588";
  var key = "1def5fe3b34bf0b805c18246a4acb388cef62d3f";
  var data = "actid=" + id + "&key=" + key + "&event=" + event + "&visit=%7B%22email%22%3A%22" + email + "%22%7D";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  xhr.send(data);
}
