export type TextRange = { from: number; to: number };

export const smartMatch = (
  input: string,
  searchText: string
): Array<TextRange> | null => {
  // TODO: implement

  // although I am creating sections here for each word of the string, I decided to simplify and not use sections
	let sections = input.split(/(?=[A-Z])|[^a-zA-Z0-9]+/);
  console.log(sections);

  input = input.toLowerCase();
  searchText = searchText.toLowerCase();
	
	let ranges = [];	
  let positionsCount = 0;

  const fullMatchPos = input.search(searchText);
  if (fullMatchPos > -1) {
    console.log('full match!');
    return [{from: fullMatchPos, to: fullMatchPos + searchText.length - 1}];
  }
	
	for (let i = 0; i < searchText.length; i++) {
    let foundIndex = input.indexOf(searchText[i]);
    
    if (foundIndex === -1) {
      // character not found, all the string becomes invalid      
      // exit for loop and return null
      i = searchText.length;
      ranges = [];
    } else {
      if (foundIndex > 0 || ranges.length < 1) {
          // start new range
          ranges.push({from: positionsCount + foundIndex,  to: positionsCount + foundIndex});
        } else {
            // update current range ending value
            ranges[ranges.length - 1].to = positionsCount;
        }

        // we are now only interested in moving forward through the string, so we remove the already checked characters
        input = input.substring(foundIndex +1 , input.length);
        
        // position in the original full string is stored in order to create the ranges
        positionsCount += foundIndex + 1;
    }
	}	
	console.log('ranges: ', ranges);
  return ranges.length > 0 ? ranges : null;
};
