import { Frame } from '../types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export const processData = (series: Array<Frame>) => {
  const daily: { [key: string]: { z: number[]; y: number[]; x: number[] } } = {};
  const duration: {
    [key: string]: { '01-10m': number; '10-30m': number; '30-60m': number; '60-90m': number; '90-180m': number };
  } = {};

  // initiate
  series[0].fields[1].values.buffer.map(perDay => {
    const dayJs = dayjs(perDay).tz('Europe/Athens');
    if (dayJs.day() !== 0) {
      const dayformat = dayJs.format('YYYY-MM-DD');

      daily[dayformat] = { z: [], y: [], x: [] };
      duration[dayformat] = { '01-10m': 0, '10-30m': 0, '30-60m': 0, '60-90m': 0, '90-180m': 0 };
    }
  });

  series.map(category => {
    if (category.name == 'zAxis') {
      category.fields[1].values.buffer.map((perDay, i) => {
        const day = dayjs(perDay)
          .tz('Europe/Athens')
          .format('YYYY-MM-DD');
        if (daily[day]) daily[day].z = [category.fields[0].values.buffer[i]];
      });
    }

    if (category.name == 'yAxis') {
      category.fields[1].values.buffer.map((perDay, i) => {
        const day = dayjs(perDay)
          .tz('Europe/Athens')
          .format('YYYY-MM-DD');
        if (daily[day])
          daily[day].y = [
            category.fields[0].values.buffer[i] ? Number(category.fields[0].values.buffer[i].toFixed(2)) : 0,
          ];
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

  Object.keys(duration).map(perDay => {
    const avg =
      duration[perDay]['01-10m'] * 5.5 +
      duration[perDay]['10-30m'] * 20 +
      duration[perDay]['30-60m'] * 45 +
      duration[perDay]['60-90m'] * 45 +
      duration[perDay]['90-180m'] * 135;

    if (avg == 0) {
      delete daily[perDay];
    } else {
      daily[perDay].x = [Math.round(avg / 10) / 10];
    }
  });

  return Object.keys(daily).map(day => ({
    ...daily[day],
    name: day,
    hovertemplate: '%{z} Customers<br>' + '%{x} min<br>' + '%{y} % Return Rate',
    type: 'scatter3d',
    mode: 'markers',
    marker: { size: 5 },
  }));
};
