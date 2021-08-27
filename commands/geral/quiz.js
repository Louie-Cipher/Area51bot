const Discord = require("discord.js")
const profileModel = require('../../mongoSchema/profile');
const { quiz, add_question } = require('discord-quiz');

module.exports = {
  name: 'quiz',
  aliases: ['trivia'],
  description: "inicia uma sessão de quizes",
  userPermissions: 'MANAGE_MESSAGES',

  async execute(client, message, args) {
    return message.channel.send('comando em manutenção...');

    let questions = { };
    let i = 0;

    function addQuestion(pergunta, resposta, erradas) {
      questions[i].question = pergunta;
      questions[i].answer = resposta;
      questions[i].wrong = erradas;
      i++
    }

    function shuffle(array) {
      var currentIndex = array.length,  randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    }

    addQuestion('Onde está localizada a obra "Mona lisa" de Leonardo DaVinci?', 'Museu do Louvre', ['Jaj Mahal', 'MASP', 'Museu do Vaticano']);
    addQuestion('Qual desses personagens da Marvel **nunca** ergueu o Mjolnir(martelo do Thor)?', 'Homem de ferro', ['Visão', 'Capitão América', 'Bill Raio Beta', 'Valquíria']);
    addQuestion('Qual o nome do Protagonista do anime One Piece?', 'Monkey D. Luffy', ['Ronoroa Zoro', 'Tony Tony Chopper', 'Gol D. Roger']);
    addQuestion('Em que ano um humano pisou na Lua pela primeira vez?', '1969', ['1980', '1965', '1972', '1970']);
    addQuestion('Em que ano foi lançado o sistema operacional Windows 7?', '2009', ['2006', '2007', '2008', '2010']);
    addQuestion('Qual foi o primeiro vídeo do YouTube a atingir 1 bilhão de visualizações?', 'Psy - Gangnam Style', ['Luis Fonsi – Despacito', 'Lady Gaga - Bad Romance', 'Masha e o Urso', 'Baby Shark']);

    
    let random = questions[ Math.floor(Math.random() * i) ]
    
    let options = random.wrong.push(random.answer);

    let randomOptions = shuffle(options);


  }
}