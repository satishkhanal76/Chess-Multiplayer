import { Command } from "./Command.js";

export class CommandHandler {

    #commands;

    //the index of the current command of the command timeline (changes with undo and redo)
    #currentCommandIndex;

    //the index of the furthest ahead command on the command timelien (does not change with undo and redo)
    #commandIndex;


    constructor() {
        this.#commands = [];
        this.#currentCommandIndex = -1;
        this.#commandIndex = -1;
    }

    addCommand(command) {
        if(!(command instanceof Command)) return null;
        
        if(this.#commandIndex !== this.#currentCommandIndex) {
            this.executeCommands();
        };

        this.#commands.push(command);

        this.#incrementCommandIndex();
        this.#incrementCurrentCommandIndex();
    }

    removeCommand() {
        this.#commands.pop();
        this.#decrementCommandIndex();
    }

    /**
     * Executes all commands from currentCommandIndex to commandIndex at once
     */
    executeCommands() {
        for (let i = this.#currentCommandIndex; i <= this.#commandIndex; i++) {
            this.redoCommand();
        }
    }

    executeNextCommand() {
        if(!this.#commands[this.#currentCommandIndex]) {
            console.error("No commands to execute!");
            return;
        };

        let commandSuccess = this.#commands[this.#currentCommandIndex].execute();

        if(!commandSuccess) {
            this.removeCommand();
            this.#decrementCurrentCommandIndex();
        }
    }

    #incrementCurrentCommandIndex() {
        this.#currentCommandIndex = this.#currentCommandIndex + 1;
    }

    #decrementCurrentCommandIndex() {
        this.#currentCommandIndex = this.#currentCommandIndex - 1;
    }

    #incrementCommandIndex() {
        this.#commandIndex = this.#commandIndex + 1;
    }

    #decrementCommandIndex() {
        this.#commandIndex = this.#commandIndex - 1;
    }

    undoCommand() {
        if(this.#currentCommandIndex < 0) {
            return null;
        }
        
        this.#commands[this.#currentCommandIndex].undo();
        
        this.#decrementCurrentCommandIndex();
    }

    redoCommand() {
        this.#incrementCurrentCommandIndex();

        if(this.#currentCommandIndex > this.#commandIndex) {
            this.#currentCommandIndex = this.#commandIndex;
            return null;
        }
        this.#commands[this.#currentCommandIndex].redo();
    }
    getCurrentCommandIndex() {
        return this.#currentCommandIndex;
    }

    getCommandIndex() {
        return this.#commandIndex;
    }
}