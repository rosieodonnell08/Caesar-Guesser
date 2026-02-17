import React, {useState, useEffect} from 'react';
import { Button, Text, View, StyleSheet, Pressable, label}  from 'react-native';
import { getAString, getVowelMapArray, encode, decode } from './caeser';

export default function GameComponent() {

    /* This is sample code to test out the ceaser scripts - feel free to delete */
    /* Outputs to the terminal in VSCode when app is running */
    const plain = getAString(81);//fixed string number for testing - drop parameter for random
    const key = 2;
    const guess = 2;
    const hintString = getVowelMapArray(plain).map(v => (v ? "^" : " ")).join("");
    const encoded = encode(plain, key);
    const decoded = decode(encoded, guess);
    console.log("+-----")
    console.log("|   Plain text: "+plain);
    console.log("|       Vowels: "+hintString);
    console.log("| Encoded text: "+encoded);
    console.log("| Decoded text: "+decoded);
    console.log("+-----")
    /* End of sample code for Caeser */

    // making game states 
    const [originalPhrase, setOriginalPhrase] = useState(""); //our original phrase
    const [encodedPhrase, setCodedPhrase] = useState(""); //the scrambled phrase
    const [displayText, setText] = useState(""); //the text on display on screen
    const [rows, setRows] = useState([]); //the rows for each guess
    const [currentRow, setCurrentRow] = useState(1); //the display for the current row
    const [pressedKeys, setPressedKeys] = useState([])
    const [score, setScore] = useState(0);


    // starting up our game and getting our random phrase and code

    function startGame() {
        const phrase = getAString();
        const randKey = encode(phrase, 1);

        setOriginalPhrase(phrase);
        setCodedPhrase(randKey);
        setText(randKey);

        setRows([randKey, "", "", "", "", ""]);
        setCurrentRow(1);
    }

    // gam estarts when our app loads in 
    useEffect(() => {
        startGame();
    }, []);

    //guess handler
    function handleGuess(num) {

        if (currentRow> 5) return; //oour maximum of 5 guesses

        const decoded = decode(encodedPhrase, num);

        //updating our row array
        const newRows = [...rows];
        newRows[currentRow] = decoded;
        setRows(newRows);

        setPressedKeys([...pressedKeys, num]);

        //move to the next row
        setCurrentRow(currentRow + 1);

        checkWin(decoded, num);

    }

     function checkWin(decoded, key) {
        if (decoded === originalPhrase) {
            setScore((score) => score + 2 ** (4 - pressedKeys.length))
        }
    }

    //for each letter to be played in a single box 
    function GuessBox({letter}) {
        return (
            <View style={styles.box}>
                <Text style={styles.boxText}>{letter}</Text>
            </View>
        )
    }

    //for each row of 12 boxes in the game
    function GuessRow({text}) {

       // ensure that theres always 12 chars
        let letters = (text || "").padEnd(12, " ").split("");

        return (
            <View style={styles.row}>
                {letters.map((l, i) => (
                    <GuessBox key={i} letter={l} />
                ))}
            </View>
        );
    }

    function GuessGrid({rows}) {
       return (
            <View style={styles.grid}>
                {rows.map((r, i) => (
                 <GuessRow key={i} text={r} />
                ))}
         </View>
    );
    }

    //creating our buttons with their keys, ranging from -13 to +12
    const keyRows = [
        [-13, -11, -9, -7, -5, -3, -1],
        [-12, -10, -8, -6, -4, -2],
        [13, 11, 9, 7, 5, 3, 1],
        [12, 10, 8, 6, 4, 2]
    ];

    function GuessKeyboard() {
    return (
        <View style={styles.keyboard}>
            {keyRows.map((row, ri) => (
                <View
                    key={ri}
                    style={[
                        styles.buttonRow,
                        ri % 2 === 1 && styles.offsetRow //checking to see if our row index is even or odd if false it shifts the keys to the right
                    ]}
                >
                    {row.map(k => {
                        const label = k > 0 ? "+" + k : k.toString(); //if our k value is greater than 0 then we add the plus sign to it
                        return (
                            <Pressable
                                key={k}
                                style={styles.button}
                                onPress={() => handleGuess(k)}
                            >
                                <Text style={styles.buttonText}>{label}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            ))}
        </View>
    );

}

    return (
        <View style={styles.background}>

            <Text style={styles.title}>CAESER GUESSER</Text>

            <GuessGrid rows={rows} />

            <GuessKeyboard />

            <Button title="New Game" onPress={startGame} />

            <Text style={styles.score}>
                Score: {score}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({

    background: {
        flex: 1,
        backgroundColor: "#484747", 
        alignItems: "center", 
        justifyContent: "center",
        paddingTop: 40
    },
    
    title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "yellow"
    },
    
    grid: {
        marginBottom: 20
    },

    row: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 4
    },

    box: {
        width: 22,
        height: 22,
        borderWidth: 1,
        borderColor: "#9a9a9a",
        justifyContent: "center",
        alignItems: "center",
        margin: 1,
        backgroundColor: "#ddd"
    },

    boxText: {
        fontSize: 14,
        fontWeight: "bold"
    },

    button: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#f2c94c",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3
    },
    
    buttonBox: {
        width: 40,
        margin: 2
    },

    buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111"
    },

    buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8
    },

    offsetRow: {
        marginLeft: 18
    },

    pressedButton: {
        backgroundColor: "darkyellow"
    },

    score: {
    color: "yellow",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold"
    },

});