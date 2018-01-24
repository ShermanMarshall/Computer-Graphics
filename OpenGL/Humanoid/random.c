#include "stdio.h"
#include "stdlib.h"
#include "time.h"
#include "math.h"

int main() {
	srand(time(0));
	
	//int max = pow(2, 31);
	//printf("max: %d\n", max);

	int random = rand();
	for (int x = 0; x < 20; x++) {
		printf("%i: %i\n", x+1, random);
		random = rand();
	}
}
