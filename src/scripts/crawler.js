const Crawler = require("crawler");
const fs = require('fs');

const weekDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

function changeTabToOneSpace(string) {
    return string.replace(/\t+/g, ' ')
        .replace(/&#xE3;/g, 'ã')
        .replace(/&#xE2;/g, 'â')
        .replace(/&#xE0;/g, 'à')
        .replace(/&#xC1;/g, 'Á')
        .replace(/&#xC2;/g, 'Â')
        .replace(/&#xB0;/g, '°')
        .replace(/&#xE9;/g, 'é')
        .replace(/&#xED;/g, 'í')
        .replace(/&#xEA;/g, 'ê')
        .replace(/&#xBA;/g, 'º')
        .replace(/&#xF4;/g, 'ô')
        .replace(/&#xF3;/g, 'ó')
        .replace(/&#xFA;/g, 'ú')
        .replace(/&#xE7;/g, 'ç')
        .replace(/( )+/g, ' ');
}

function identifyLocationsByBreakLine(string, stringPattern) {
    return string.split(stringPattern);
}


const c = new Crawler({
    maxConnections: 10,
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;

            const Day = {}
            weekDays.map(day => {
                Day[day] = identifyLocationsByBreakLine($("span[id*='data_" + day + "']").html())[0]
            });

            const weekDaysFormated = {}

            weekDays.map((day) => {
                let a = identifyLocationsByBreakLine($("span[id*='Label_" + day + "']").html(), '<br>').map(r => { return changeTabToOneSpace(r) });

                weekDaysFormated[Day[day]] = { streets: [] };

                a.forEach((street) => {
                    weekDaysFormated[Day[day]].streets.push({
                        name: street.replace(/\(.+\)/gi, '').split('  ')[0],
                        velocity: street.match(/\(.+\)/gi)[0].replace("(", '').replace(")", ''),
                        neighborhood: street.replace(/\(.+\)/gi, '').split('  ')[1]
                    });
                });

            });

            fs.writeFile("src/temp/radarsList.json", JSON.stringify(weekDaysFormated), 'utf8', err => {
                if (err) {
                    return console.log(err);
                }

                console.log('json file Created!');
                console.log(weekDaysFormated);
            });
            return weekDaysFormated;
        }
        done();
    }
});

c.queue('http://servicos2.sjc.sp.gov.br/servicos/radares.aspx');
