let convert = {};
/**
 * 
 * @param {Object[]} requests - the array of request objects. 
 * @param {Object} request - source, destination, priority, id, equipmentt
 * @param {Objeect[]} transpoters - the array of available transpoter with their last known location, id and equipments.
 * @param {int[][]} distances - distance matrix with 0th col the names of the location. Matrix must be symmetric with diagonal = 0.
 */
//finds the closest transpoter to the source of the request
convert.recommend = function (requests, transpoters, distances) {
	const optimalTranspoter = [];

	requests.sort((a, b) => {
		if (a.priority === 'High' && b.priority === 'Normal') {
			return -1;
		} else {
			return 1;
		}
	})

	for (let i = 0; i < requests.length; i++) {
		const source = requests[i].source
		const sourceBuilding = source.building
		const sourceFloor = source.floor
		const sameEquipmentTranspoter = [];

		for (let j = 0; j < transpoters.length; j++) {
			if (transpoters[j].equiptment.includes(requests[i].equiptment)) {
				let trans = {
					transpoter: transpoters[j],
					index :j
				}
				sameEquipmentTranspoter.push(trans)
			}
		}

		sameEquipmentTranspoter.sort((a, b) => {
			return score(a,b,sourceFloor,sourceBuilding,distances);
		});

		if (sameEquipmentTranspoter.length > 0) {
			const answer = {
				request_id: requests[i].id,
				transpoter_id1: sameEquipmentTranspoter[0].transpoter.id,
				transpoter_id2: null,
				transpoter_id3: null
            }
            if(sameEquipmentTranspoter.length > 1){
            answer.transpoter_id2 = sameEquipmentTranspoter[1].transpoter.id;
            }
            if(sameEquipmentTranspoter.length > 2){
                answer.transpoter_id3 = sameEquipmentTranspoter[2].transpoter.id;
                }
			optimalTranspoter.push(answer)
		}
	}

	return optimalTranspoter;
}
/**
 * 
 * @param {String} building1 - the name of the first building
 * @param {String} building2 - the name of the second building
 * @param {int[][]} distances - the distance matrix. 
 */
//returns the distance between two building based on the matrix distances
function distance(building1, building2, distances) {
	let i;
	let j;
	for (i = 0; i < distances.length; i++) {
		if (distances[i][0].name === building1) {
			break;
		}
	}
	for (j = 0; j < distances.length; j++) {
		if (distances[j][0].name === building2) {
			break;
		}
	}
	return distances[i][j + 1];
}
/**
 * 
 * @param {trans object} a - first trans object with transpoter and index of transpoter. 
 * @param {trans oobject} b - second trans object with transpoter and index of transpoter.
 * @param {int} sourceFloor - the source floor taken from the request
 * @param {String} sourceBuilding - the source building taken from the request
 * @param {int[][]} distances - the distnce matrix.
 */
function score(a,b,sourceFloor,sourceBuilding,distances){
	let a1 = a.transpoter;
	let b1 = b.transpoter;
	if (a1.building === b1.building) {
		if (Math.abs(a1.floor - sourceFloor) - Math.abs(b1.floor - sourceFloor) < 0) {
			return -1;
		} else {
			return 1;
		}
	} else {
		if (distance(a1.building, sourceBuilding, distances) - distance(b1.building, sourceBuilding, distances) < 0) {
			return -1;
		} else {
			return 1;
		}
	}
}


module.exports = convert;
