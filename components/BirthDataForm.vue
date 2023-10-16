<template>
  <div class="birth-data-form">
    <form
      netlify
      netlify-honeypot
      name="birth-data"
      method="POST"
      action="/success"
    >
      <p class="hidden">
        <label>
          Don't fill this out if you're human: <input name="bot-field" />
        </label>
      </p>
      <input type="hidden" name="form-name" value="birthdata" />
      <label for="birth-date">Birth date</label>
      <input id="birth-date" type="date" name="birth-date" />
      <label for="birth-time">Birth time</label>
      <input id="birth-time" type="time" name="birth-time" />
      <label for="birth-country">Birth country</label>
      <input id="birth-country" type="text" name="birth-country" />
      <label for="birth-state">Birth state</label>
      <input id="birth-state" type="text" name="birth-state" />
      <label for="birth-city">Birth city</label>
      <input id="birth-city" type="text" name="birth-city" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.birth-data-form {
  margin: 40px 40px;
  min-width: 250px;
  width: 45%;
}
input,
textarea,
button {
  font-size: inherit;
  margin: 15px 0;
  padding: 12px 20px;
  width: 100%;
}

button {
  background-color: teal;
  border: 1px solid black;
  color: white;
  width: 50%;
}

.hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
</style>
