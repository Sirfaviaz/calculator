from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import CalculationSerializer

@api_view(['POST'])
def calculate(request):
    """
    Perform a calculation based on the provided operands and operation.

    Args:
        request (HttpRequest): HTTP POST request containing 'num1', 'num2', and 'operation' in the request body.

    Returns:
        Response: JSON response containing the calculated result if successful, or error message if validation fails or division by zero occurs.
    """
    serializer = CalculationSerializer(data=request.data)
    if serializer.is_valid():
        num1 = serializer.validated_data['num1']
        num2 = serializer.validated_data['num2']
        operation = serializer.validated_data['operation']

        if operation == '+':
            result = num1 + num2
        elif operation == '-':
            result = num1 - num2
        elif operation == '*':
            result = num1 * num2
        elif operation == '/':
            if num2 == 0:
                return Response({'error': 'Division by zero not allowed'}, status=status.HTTP_400_BAD_REQUEST)
            result = num1 / num2

        return Response({'result': result}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
