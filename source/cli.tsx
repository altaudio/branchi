#!/usr/bin/env node
import {render} from 'ink';
import meow from 'meow';
import App from './ui';

const cli = meow(`
	Usage
	  $ branchi

	Options
		--name  Your name

	Examples
	  $ branchi --name=Jane
	  Hello, Jane
`, {
	flags: {
		name: {
			type: 'string'
		}
	}
});

render(<App name={cli.flags.name}/>);
