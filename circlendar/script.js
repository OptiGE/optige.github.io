const currentDate = new Date();
const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
const dayOfYear = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24));
document.querySelector('.watch-needle').style.setProperty('--day-of-year', dayOfYear);

const container = document.querySelector('.container');
const circle = document.querySelector('.circle');
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let accumulatedAngle = 0;

const isLeapYear = currentDate.getFullYear() % 4 === 0 && (currentDate.getFullYear() % 100 !== 0 || currentDate.getFullYear() % 400 === 0);
const daysInYear = isLeapYear ? 366 : 365;
let currentDay = new Date(currentDate.getFullYear(), 0, 1);

for (let i = 1; i <= daysInYear; i++) {
  const angle = (1 / daysInYear) * 360;

  if (currentDay.getDate() === 1) {
    // Month divider
    const newDivider = document.createElement('div');
    newDivider.classList.add('month-divider');
    newDivider.style.transform = `translate(-50%, -100%) rotate(${accumulatedAngle}deg)`;
    circle.appendChild(newDivider);

    // Month label
    const newLabel = document.createElement('div');
    newLabel.classList.add('month-label');
    newLabel.textContent = monthNames[currentDay.getMonth()];
    const labelOffset = (circle.offsetWidth * 0.5) + 15;
    const angleInRadians = (accumulatedAngle - 90) * (Math.PI / 180);
    const posX = (labelOffset * Math.cos(angleInRadians));
    const posY = (labelOffset * Math.sin(angleInRadians));
    newLabel.style.transform = `translate(-50%, -50%) translate(${posX}px, ${posY}px)`;
    container.appendChild(newLabel);
  }

  if (currentDay.getDay() === 1) {
    // Week divider
    const newWeekDivider = document.createElement('div');
    newWeekDivider.classList.add('week-divider');
    newWeekDivider.style.transform = `translate(-50%, -100%) rotate(${accumulatedAngle}deg)`;
    circle.appendChild(newWeekDivider);
  }

  currentDay.setDate(currentDay.getDate() + 1);
  accumulatedAngle += angle;
}
