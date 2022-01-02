import { BranchesContext } from "../components/BranchesProvider";
import { useContext, useState } from "react";
import { useInput } from "ink";

function useSearch() {
	const { branches, setFilteredBranches } = useContext(BranchesContext);
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	const search = (term: string) => {
		if (!term) {
			setSearchTerm(null);
		}

		const parsedTerm = term.toLowerCase();

		setSearchTerm(parsedTerm);

		const searched = branches.filter(({ name }) =>
			name.toLowerCase().includes(parsedTerm)
		);

		setFilteredBranches(searched);
	};

	useInput((_, key) => {
		if (key.escape) {
			search("");
		}
	});

	return { search, searchTerm };
}

export { useSearch };
