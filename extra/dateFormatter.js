/**
 * @param {Object} params
 * @param {Date} params.latestDate A data mais atual
 * @param {Date} params.oldestDate A data mais antiga
 * @param {Boolean} params.ignoreYears Para ignorar os anos de diferença
 * @param {Boolean} params.ignoreMonths Para ignorar os meses de diferença
 * @param {Boolean} params.ignoreDays Para ignorar os dias de diferença
 * @param {Boolean} params.ignoreHours Para ignorar as horas de diferença
 * @param {Boolean} params.ignoreMinutes Para ignorar os minutos de diferença
 * @param {Boolean} params.ignoreSeconds Para ignorar os segundos de diferença
 * @param {Boolean} params.ignoreMilliseconds Para ignorar os milissegundos de diferença
 */
module.exports = (params) => {

        if (!params.latestDate || !params.oldestDate) return console.error('É obrigatório especificar a data n° 1 e a data n° 2');

        const date = new Date(params.latestDate.getTime() - params.oldestDate.getTime());

        let mainString = String();
        let array = [];

        let anos = String();
        let meses = String();
        let dias = String();
        let horas = String();
        let minutos = String();
        let segundos = String();
        let milissegundos = String();

        if (date.getFullYear() - 1970 != 0) {
            anos = `${date.getFullYear() - 1970} ano`;
            if (date.getFullYear() - 1970 > 1) anos += 's'
            if (params.ignoreYears !== true) array.push(anos);
        }
        if (date.getMonth() != 0) {
            meses = `${date.getMonth()}`;
            if (date.getMonth() > 1) meses += ' meses'
            else meses += ' mês'
            if (params.ignoreMonths !== true) array.push(meses);
        }
        if (date.getDate() != 0) {
            dias = `${date.getDate()} dia`;
            if (date.getDate() > 1) dias += 's'
            if (params.ignoreDays !== true) array.push(dias);
        }
        if (date.getHours() != 0) {
            horas = `${date.getHours()} hora`;
            if (date.getHours() > 1) horas += 's'
            if (params.ignoreHours !== true) array.push(horas);
        }
        if (date.getMinutes() != 0) {
            minutos = `${date.getMinutes()} minuto`;
            if (date.getMinutes() > 1) minutos += 's'
            if (params.ignoreMinutes !== true) array.push(minutos);
        }
        if (date.getSeconds() != 0) {
            segundos = `${date.getSeconds()} segundo`;
            if (date.getSeconds() > 1) segundos += 's'
            if (params.ignoreSeconds !== true) array.push(segundos);
        }
        if (date.getMilliseconds() != 0) {
            milissegundos = `${date.getMilliseconds()} milissegundo`;
            if (date.getMilliseconds() > 1) milissegundos += 's'
            if (params.ignoreMilliseconds !== true) array.push(milissegundos);
        }

        for (let i = 0; i < array.length; i++) {

            if (i > 0 && i <= array.length - 2) mainString += ',';
            if (i > 0 && i == array.length - 1) mainString += ' e';
            if (i != 0) mainString += ' ';
            mainString += array[i];

        }

        return {
            main: mainString,
            anos: Math.floor(date.getTime() / 1000 / 60 / 24 / 30 / 365),
            meses: Math.floor(date.getTime() / 1000 / 60 / 24 / 30),
            dias: Math.floor(date.getTime() / 1000 / 60 / 24),
            minutos: Math.floor(date.getTime() / 1000 / 60),
            segundos: Math.floor(date.getTime() / 1000),
            milissegundos: Math.floor(date.getTime())
        }
    }
