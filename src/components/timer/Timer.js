import { useState, useEffect } from "react"
import {
  interval,
  takeUntil,
  Subject,
  fromEvent,
  buffer,
  map,
  filter,
  debounceTime,
} from "rxjs"
import "./timer.css"

export default function Timer() {
  const [sec, setSec] = useState(0)
  const [startStop, setStartStop] = useState(false)

  let time = new Date(sec).toISOString().slice(11, 19)

  useEffect(() => {
    const stream$ = new Subject()

    interval(1000)
      .pipe(takeUntil(stream$))
      .subscribe(() => {
        if (startStop) {
          setSec((val) => val + 1000)
        }
      });

    return () => {
      stream$.next()
      stream$.complete()
    };
  }, [startStop]);

  const start = () => {
    if (!startStop) {
      setStartStop(true)
    } else if (startStop) {
      setStartStop(false)
      setSec(0);
    }
  };

  const reset = () => setSec(0);

  const doubleClick = () => {
    const click$ = fromEvent(document, "click")
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((clicks) => clicks.length),
      filter((clicksLength) => clicksLength >= 2)
    );

    doubleClick$.subscribe((_) => {
      setStartStop(false)
    });
  };

  return (
    <div className="container">
      <div className="contant">
        <h1>Timer</h1>
        <h2 className="time">{time}</h2>
        <button className="button" onClick={start}>
          Start/Stop
        </button>
        <button className="button" onClick={reset}>
          Reset
        </button>
        <button className="button" onClick={doubleClick}>
          Wait
        </button>
      </div>
    </div>
  );
}
