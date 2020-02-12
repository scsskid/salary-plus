# Salary Plus

## Start server

- `npm install`
- `npm run serve`

Server will reload according to settings in `.lightserverrc`

## Debug

Test Commands

```js
app.model.addRecord({
  date: "2020-12-24",
  timeBegin: "15:00",
  timeEnd: "01:00"
})
```

```js
app.model.editRecord({
  id: 3,
  date: "2017-12-24",
  timeBegin: "15:00",
  timeEnd: "01:00"
})
```