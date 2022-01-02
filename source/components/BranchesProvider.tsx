import { createContext, ReactNode, useEffect, useState } from "react";
import { exec } from "child_process";

interface FilteredBranch {
	name: string;
	index: number;
}
interface Branch {
	name: string;
}

type BranchesContext = {
	branches: Branch[];
	filteredBranches: FilteredBranch[];
	setFilteredBranches: (branches: Branch[]) => void;
};

const BranchesContext = createContext<BranchesContext>({
	branches: [],
	filteredBranches: [],
	setFilteredBranches: () => {
		return;
	},
});

function BranchesProvider({ children }: { children: ReactNode }) {
	const [branches, setBranches] = useState<Branch[]>([]);
	const [filteredBranches, setFilteredBranches] = useState<FilteredBranch[]>(
		[]
	);

	const mapFiltered = (branches: Branch[]) =>
		branches.map(({ name }, index) => ({ name, index }));

	useEffect(() => {
		exec("git branch", (error, stdout, stderr) => {
			if (error) {
				throw error;
			}
			if (stderr) {
				throw stderr;
			}

			const parsedBranches = stdout
				.replace("*", "")
				.split("\n")
				.map((branch) => branch.replace(/\s/g, ""))
				.filter((branch) => !!branch)
				.map((branch, index) => ({ index, name: branch }))
				.sort();

			setBranches(parsedBranches);
			setFilteredBranches(mapFiltered(parsedBranches));
		});
	}, []);

	const updateFilteredBranches = (branches: Branch[]) => {
		setFilteredBranches(mapFiltered(branches));
	};

	return (
		<BranchesContext.Provider
			value={{
				branches,
				filteredBranches,
				setFilteredBranches: updateFilteredBranches,
			}}
		>
			{children}
		</BranchesContext.Provider>
	);
}

export { BranchesProvider, BranchesContext };
