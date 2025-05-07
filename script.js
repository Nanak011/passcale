const password = document.getElementById('password');
const feedback = document.getElementById('feedback');
const strengthBar = document.getElementById('strengthBar');
const timeToCrack = document.getElementById('timeToCrack');
const toggle = document.getElementById('toggle');

toggle.addEventListener('click', () => {
  if (password.type === "password") {
    password.type = "text";
    toggle.textContent = "Hide";
  } else {
    password.type = "password";
    toggle.textContent = "Show";
  }
});

function calculateEntropy(pwd) {
  let poolSize = 0;
  if (/[a-z]/.test(pwd)) poolSize += 26;
  if (/[A-Z]/.test(pwd)) poolSize += 26;
  if (/\d/.test(pwd)) poolSize += 10;
  if (/[^A-Za-z0-9]/.test(pwd)) poolSize += 32; // symbols
  return pwd.length * Math.log2(poolSize);
}

function formatTime(seconds) {
  if (seconds < 1) return "<1 second";
  const units = [
    { label: "year", secs: 31536000 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
    { label: "second", secs: 1 }
  ];
  const parts = [];
  for (let unit of units) {
    const value = Math.floor(seconds / unit.secs);
    if (value > 0) {
      parts.push(value + " " + unit.label + (value > 1 ? "s" : ""));
      seconds %= unit.secs;
    }
  }
  return parts.join(", ");
}

function estimateCrackTime(entropy) {
  const guessesPerSecond = 1e10;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond;
  return formatTime(seconds);
}

password.addEventListener('input', () => {
  const pwd = password.value;
  let strength = 0;

  if (pwd.length >= 8) strength++;
  if (/[A-Z]/.test(pwd)) strength++;
  if (/[a-z]/.test(pwd)) strength++;
  if (/\d/.test(pwd)) strength++;
  if (/[^A-Za-z0-9]/.test(pwd)) strength++;

  const entropy = calculateEntropy(pwd);
  const crackTime = estimateCrackTime(entropy);

  switch (strength) {
    case 0:
    case 1:
      feedback.textContent = 'Very Weak';
      strengthBar.style.background = 'red';
      strengthBar.style.width = '20%';
      break;
    case 2:
      feedback.textContent = 'Weak';
      strengthBar.style.background = 'orange';
      strengthBar.style.width = '40%';
      break;
    case 3:
      feedback.textContent = 'Moderate';
      strengthBar.style.background = 'yellow';
      strengthBar.style.width = '60%';
      break;
    case 4:
      feedback.textContent = 'Strong';
      strengthBar.style.background = 'lightgreen';
      strengthBar.style.width = '80%';
      break;
    case 5:
      feedback.textContent = 'Very Strong';
      strengthBar.style.background = 'lime';
      strengthBar.style.width = '100%';
      break;
  }

  timeToCrack.textContent = "Estimated crack time: " + crackTime;
});
