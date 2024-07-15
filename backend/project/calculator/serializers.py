from rest_framework import serializers

class CalculationSerializer(serializers.Serializer):
    num1 = serializers.FloatField()
    num2 = serializers.FloatField()
    operation = serializers.ChoiceField(choices=['+', '-', '*', '/'])