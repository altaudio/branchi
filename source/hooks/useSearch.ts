import { BranchesContext } from "../components/BranchesProvider";
import { useContext, useState } from "react";

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

	return { search, searchTerm };
}

export { useSearch };
