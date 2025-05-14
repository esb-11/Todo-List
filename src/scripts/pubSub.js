const events = {};

function on(eventName, fn) {
  events[eventName] = events[eventName] || [];
  console.log(`${fn.name} added to ${eventName}`);
  events[eventName].push(fn);
}

function off(eventName, fn) {
  if (events[eventName]) {
    for (let i = 0; i < events[eventName].length; i++) {
      if (events[eventName][i === fn]) {
        events[eventName].splice(i, 1);
        console.log(`${fn.name} removed from ${eventName}`);
        break;
      }
    }
  }
}

function emit(eventName, ...data) {
  if (events[eventName]) {
    events[eventName].forEach((fn) => {
      console.log(`${eventName}: ${fn.name}(${data})`);
      fn(...data);
    });
  }
}

const pubSub = { on, off, emit };

export { pubSub };
