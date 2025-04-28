console.log("Start");

setImmediate(() => {
  console.log("Immediate 1");
});

setTimeout(() => {
  console.log("Timeout 1");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
});

process.nextTick(() => {
  console.log("Next Tick 1");
});

console.log("End");
