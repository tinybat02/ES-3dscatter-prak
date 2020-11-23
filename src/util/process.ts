import { Frame } from '../types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const processData = (series: Array<Frame>) => {
  const data: { [key: string]: { z: number[]; y: number[]; x: number[]; text: string[] } } = {};
  const duration: {
    [key: string]: { '01-10m': number; '10-30m': number; '30-60m': number; '60-90m': number; '90-180m': number };
  } = {};
  const dayToWeekday: { [key: string]: string } = {};
  const dayOrder: string[] = [];
  // initiate
  series[0].fields[1].values.buffer.map(perDay => {
    const dayJs = dayjs(perDay).tz('Europe/Athens');
    if (dayJs.day() !== 0) {
      const dayformat = dayJs.format('YYYY-MM-DD');
      const weekday = dayJs.format('dddd');
      dayToWeekday[dayformat] = weekday;
      dayOrder.push(dayformat);
      if (!data[weekday]) {
        data[weekday] = { z: [], y: [], x: [], text: [] };
      }
      duration[dayformat] = { '01-10m': 0, '10-30m': 0, '30-60m': 0, '60-90m': 0, '90-180m': 0 };
    }
  });

  series.map(category => {
    if (category.name == 'zAxis') {
      category.fields[1].values.buffer.map((perDay, i) => {
        const date = dayjs(perDay)
          .tz('Europe/Athens')
          .format('YYYY-MM-DD');
        const weekday = dayjs(perDay)
          .tz('Europe/Athens')
          .format('dddd');
        if (data[weekday]) {
          data[weekday].z.push(category.fields[0].values.buffer[i]);
          data[weekday].text.push(date);
        }
      });
    }

    if (category.name == 'yAxis') {
      category.fields[1].values.buffer.map((perDay, i) => {
        const weekday = dayjs(perDay)
          .tz('Europe/Athens')
          .format('dddd');
        if (data[weekday])
          data[weekday].y.push(
            category.fields[0].values.buffer[i] ? Number(category.fields[0].values.buffer[i].toFixed(2)) : 0
          );
      });
    }

    if (category.name == '01-10m') {
      category.fields[1].values.buffer.map((perDay, i) => {
        const day = dayjs(perDay)
          .tz('Europe/Athens')
          .format('YYYY-MM-DD');
        if (duration[day]) duration[day]['01-10m'] = category.fields[0].values.buffer[i];
      });
    }

    if (category.name == '10-30m') {
      category.fields[1].values.buffer.map((perDay, i) => {
        const day = dayjs(perDay)
          .tz('Europe/Athens')
          .format('YYYY-MM-DD');
        if (duration[day]) duration[day]['10-30m'] = category.fields[0].values.buffer[i];
      });
    }

    if (category.name == '30-60m') {
      category.fields[1].values.buffer.map((perDay, i) => {
        const day = dayjs(perDay)
          .tz('Europe/Athens')
          .format('YYYY-MM-DD');
        if (duration[day]) duration[day]['30-60m'] = category.fields[0].values.buffer[i];
      });
    }

    if (category.name == '60-90m') {
      category.fields[1].values.buffer.map((perDay, i) => {
        const day = dayjs(perDay)
          .tz('Europe/Athens')
          .format('YYYY-MM-DD');
        if (duration[day]) duration[day]['60-90m'] = category.fields[0].values.buffer[i];
      });
    }

    if (category.name == '90-180m') {
      category.fields[1].values.buffer.map((perDay, i) => {
        const day = dayjs(perDay)
          .tz('Europe/Athens')
          .format('YYYY-MM-DD');
        if (duration[day]) duration[day]['90-180m'] = category.fields[0].values.buffer[i];
      });
    }
  });

  dayOrder.map(perDay => {
    const avg =
      duration[perDay]['01-10m'] * 5.5 +
      duration[perDay]['10-30m'] * 20 +
      duration[perDay]['30-60m'] * 45 +
      duration[perDay]['60-90m'] * 75 +
      duration[perDay]['90-180m'] * 135;

    data[dayToWeekday[perDay]].x.push(Math.round(avg / 10) / 10);
  });

  return Object.keys(data).map(day => ({
    ...data[day],
    name: day,
    hovertemplate: '%{z} Customers<br>' + '%{x} min<br>' + '%{y} % Return Rate<br>' + '%{text}',
    type: 'scatter3d',
    mode: 'markers',
    marker: { size: 5 },
  }));
};
