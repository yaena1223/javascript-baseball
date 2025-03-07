const MissionUtils = require('@woowacourse/mission-utils');
class App {
  constructor() {
    this.answer = '';
  }

  play() {
    MissionUtils.Console.print('숫자 야구 게임을 시작합니다.');
    this.play_number_baseball_game();
  }

  play_number_baseball_game() {
    this.answer = this.computer_random_number();
    this.receive_guess_input();
  }

  computer_random_number() {
    const NUMBER_LIST = [];
    while (NUMBER_LIST.length < 3) {
      const SINGLE_DIGIT = MissionUtils.Random.pickNumberInRange(1, 9);
      if (!NUMBER_LIST.includes(SINGLE_DIGIT)) {
        NUMBER_LIST.push(SINGLE_DIGIT);
      }
    }
    return NUMBER_LIST.join('');
  }

  receive_guess_input() {
    MissionUtils.Console.readLine('숫자를 입력해주세요 : ', input_num => {
      const VALIDATION = this.check_input_validation(input_num);
      if (!VALIDATION) {
        throw '잘못된 형식입니다';
      }
      this.check_continue(input_num);
    });
  }

  check_input_validation(input) {
    const NUM_RANGE = /^[1-9]+$/;
    let checkNum = NUM_RANGE.test(input);
    let checkLength = input.length;
    const SET = new Set(input);
    let checkOverlap = SET.size;
    if (checkNum && checkLength === 3 && checkOverlap === 3) return true;
    return false;
  }

  check_continue(input) {
    const COMPARE_RESULT = this.return_hint(input, this.answer);
    MissionUtils.Console.print(COMPARE_RESULT);
    if (COMPARE_RESULT != '3스트라이크') {
      this.receive_guess_input();
    } else {
      MissionUtils.Console.print('3개의 숫자를 모두 맞히셨습니다! 게임 종료');
      this.receive_restart_input();
    }
  }

  compare_and_count_strike_ball(input, answer) {
    let strike = 0;
    let ball = 0;
    const INPUT_NUM = [...input];
    INPUT_NUM.map((input, i) => {
      if (input === answer[i]) strike += 1;
      else if (answer.indexOf(input) > -1 && answer.indexOf(input) < 3) {
        ball += 1;
      }
    });
    return [strike, ball];
  }

  return_hint(input, answer) {
    const [STRIKE, BALL] = this.compare_and_count_strike_ball(input, answer);
    const HINT = [];
    if (BALL === 0 && STRIKE === 0) return '낫싱';
    if (BALL > 0) HINT.push(`${BALL}볼`);
    if (STRIKE > 0) HINT.push(`${STRIKE}스트라이크`);
    return HINT.join(' ');
  }

  receive_restart_input() {
    MissionUtils.Console.readLine(
      '게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요. : ',
      input_num => {
        this.check_restart_input_validation(input_num);
      },
    );
  }

  check_restart_input_validation(input) {
    if (input === '1') {
      const app = new App();
      app.play_number_baseball_game();
    } else if (input === '2') {
      MissionUtils.Console.close();
    } else throw '잘못된 형식입니다';
  }
}

module.exports = App;
