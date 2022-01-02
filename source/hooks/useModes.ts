import { useState } from "react";
import { useInput } from "ink";

enum Mode {
	Navigation,
	Search,
}

function useModes() {
	const [mode, setMode] = useState<Mode>(Mode.Navigation);

	useInput((input, key) => {
		if (mode === Mode.Navigation) {
			if (input === "/") {
				setMode(Mode.Search);
				return;
			}
		}

		if (mode === Mode.Search) {
			if (key.escape || key.return) {
				setMode(Mode.Navigation);
				return;
			}
		}
	});

	return { mode };
}

export { useModes, Mode };
